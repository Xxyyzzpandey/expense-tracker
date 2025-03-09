export function getAccessCode(): string {
    let accessCode = localStorage.getItem("accessCode");
  
    if (!accessCode) {
      accessCode = Math.random().toString(36).substr(2, 6).toUpperCase(); // Example: "X3F9A2"
      localStorage.setItem("accessCode", accessCode);
      alert(`Your access code: ${accessCode} (Save this to access data from any device!)`);
    }
  
    return accessCode;
  }
  