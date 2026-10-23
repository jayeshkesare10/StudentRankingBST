/**
 * API Service for Student Ranking System Using BST
 * 
 * Handles all HTTP communication with the C++ backend.
 * Provides configurable API_BASE_URL via environment variables or UI settings.
 * Strict separation: Never pretends a C++ operation succeeded unless confirmed.
 * Preview mode is completely isolated and strictly explicit.
 */

import { previewStorage } from '../data/mockData';

// Configurable base URL resolution
export function getApiBaseUrl() {
  const localOverride = localStorage.getItem('BST_BACKEND_URL');
  if (localOverride && localOverride.trim()) {
    return localOverride.trim().replace(/\/+$/, '');
  }
  
  // Environment variable configured during build/deployment
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Safe fallback default: in production use empty or current origin if proxied,
  // in development use local C++ default port
  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }
  return '';
}

export function setCustomApiBaseUrl(url) {
  if (!url || !url.trim()) {
    localStorage.removeItem('BST_BACKEND_URL');
  } else {
    localStorage.setItem('BST_BACKEND_URL', url.trim());
  }
}

export function getIsPreviewMode() {
  return localStorage.getItem('BST_PREVIEW_MODE') === 'true';
}

export function setIsPreviewMode(enabled) {
  localStorage.setItem('BST_PREVIEW_MODE', enabled ? 'true' : 'false');
}

/**
 * Standard HTTP fetch wrapper with timeout
 */
async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl && !getIsPreviewMode()) {
    throw new Error('C++ Backend URL is not configured. Please set the API Base URL in Settings or enable Preview Mode.');
  }

  const url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `Server error (${response.status} ${response.statusText})`;
      try {
        const errorData = await response.json();
        if (errorData && (errorData.message || errorData.error)) {
          errorMessage = errorData.message || errorData.error;
        }
      } catch {
        // Response was not JSON
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Connection timed out while reaching C++ backend at ${baseUrl}`);
    }
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error(`Unable to connect to C++ backend at ${baseUrl}. Ensure your C++ server is running and CORS is enabled.`);
    }
    throw err;
  }
}

// -------------------------------------------------------------
// PUBLIC API METHODS
// -------------------------------------------------------------

/**
 * Healthcheck: Check if C++ backend server is active
 * @returns {Promise<{ status: string, timestamp?: number, isPreview?: boolean }>}
 */
export async function checkBackendHealth() {
  if (getIsPreviewMode()) {
    return { status: 'preview', isPreview: true };
  }

  try {
    const data = await request('/api/health', { timeout: 3500 });
    return { status: 'online', isPreview: false, ...data };
  } catch (err) {
    return { status: 'offline', isPreview: false, error: err.message };
  }
}

/**
 * 1. GET /api/students
 * Retrieve all students stored in the BST (usually returned in-order)
 */
export async function getStudents() {
  if (getIsPreviewMode()) {
    return { students: previewStorage.getStudents(), isPreview: true };
  }
  const data = await request('/api/students');
  // Support both array response or { students: [...] }
  const students = Array.isArray(data) ? data : (data.students || []);
  return { students, isPreview: false };
}

/**
 * 2. GET /api/leaderboard
 * Retrieve student rankings sorted by highest marks to lowest marks
 */
export async function getLeaderboard() {
  if (getIsPreviewMode()) {
    return { leaderboard: previewStorage.getLeaderboard(), isPreview: true };
  }
  const data = await request('/api/leaderboard');
  const leaderboard = Array.isArray(data) ? data : (data.leaderboard || data.students || []);
  return { leaderboard, isPreview: false };
}

/**
 * 3. GET /api/students/search?q={query}
 * Search for student by Roll Number or Name in the BST
 */
export async function searchStudent(query) {
  if (!query || !query.trim()) {
    return { results: [], isPreview: getIsPreviewMode() };
  }

  if (getIsPreviewMode()) {
    return { results: previewStorage.search(query), isPreview: true };
  }

  const cleanQuery = query.trim();
  const data = await request(`/api/students/search?q=${encodeURIComponent(cleanQuery)}`);
  const results = Array.isArray(data) ? data : (data.results || data.students || (data.student ? [data.student] : []));
  return { results, isPreview: false };
}

/**
 * 4. POST /api/students
 * Add a new student record into the C++ BST
 * @param {{ rollNo: number, name: string, marks: number }} studentData
 */
export async function addStudent(studentData) {
  if (getIsPreviewMode()) {
    const added = previewStorage.addStudent(studentData);
    return { student: added, success: true, isPreview: true };
  }

  const response = await request('/api/students', {
    method: 'POST',
    body: JSON.stringify({
      rollNo: Number(studentData.rollNo),
      name: studentData.name.trim(),
      marks: Number(studentData.marks)
    })
  });

  return { student: response.student || response, success: true, isPreview: false };
}

/**
 * 5. DELETE /api/students/:rollNo
 * Remove a student from the C++ BST by roll number
 * @param {number|string} rollNo
 */
export async function deleteStudent(rollNo) {
  const rNo = Number(rollNo);
  if (getIsPreviewMode()) {
    previewStorage.deleteStudent(rNo);
    return { success: true, rollNo: rNo, isPreview: true };
  }

  const response = await request(`/api/students/${rNo}`, {
    method: 'DELETE'
  });

  return { success: true, rollNo: rNo, data: response, isPreview: false };
}

/**
 * 6. GET /api/bst/tree
 * Retrieve the current Binary Search Tree structure for interactive visualization
 */
export async function getBSTTree() {
  if (getIsPreviewMode()) {
    return { tree: previewStorage.getBSTTree(), isPreview: true };
  }

  const data = await request('/api/bst/tree');
  return { tree: data.tree || data, isPreview: false };
}

/**
 * 7. GET /api/stats
 * Aggregate dashboard statistics (Total students, Class Average, Top Ranker)
 */
export async function getStats() {
  if (getIsPreviewMode()) {
    return { stats: previewStorage.getStats(), isPreview: true };
  }

  try {
    const data = await request('/api/stats');
    return { stats: data.stats || data, isPreview: false };
  } catch {
    // If backend doesn't implement a dedicated stats endpoint, calculate from students list
    const { students } = await getStudents();
    const total = students.length;
    if (total === 0) {
      return { stats: { totalStudents: 0, averageMarks: 0, topper: null, treeHeight: 0 }, isPreview: false };
    }
    const sum = students.reduce((acc, s) => acc + (Number(s.marks) || 0), 0);
    const avg = parseFloat((sum / total).toFixed(2));
    const sorted = [...students].sort((a, b) => b.marks - a.marks);
    return {
      stats: {
        totalStudents: total,
        averageMarks: avg,
        topper: sorted[0] || null,
        treeHeight: 0
      },
      isPreview: false
    };
  }
}
