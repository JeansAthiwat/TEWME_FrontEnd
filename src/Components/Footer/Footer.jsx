import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 py-4 mt-20">
    <div className="page-container">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground px-3">© 2025 TewMe. All rights reserved.</span>
        </div>
        {/* <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </a>
        </div> */}
      </div>
    </div>
  </footer>
  )
}

export default Footer
