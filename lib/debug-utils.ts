/**
 * Utility function to log detailed information about database operations
 */
export function logDatabaseOperation(operation: string, data: any, error?: any) {
  console.group(`Database Operation: ${operation}`)
  console.log("Data:", data)
  if (error) {
    console.error("Error:", error)
  }
  console.groupEnd()
}

/**
 * Utility function to validate object properties
 * Returns array of missing required fields
 */
export function validateRequiredFields(obj: any, requiredFields: string[]): string[] {
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      missingFields.push(field)
    }
  }

  return missingFields
}
