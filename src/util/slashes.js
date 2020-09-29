export function stripTrailingSlash (path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path
}
