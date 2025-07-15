import React, { useEffect } from "react";

export default function NotFoundPage() {
  useEffect(() => {
    // Load the 404 styles
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/404-styles.css";
    document.head.appendChild(link);

    // Load Google Fonts
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css?family=Arvo";
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(fontLink);
    };
  }, []);

  return (
    <section className="page_404">
      <div className="container mx-auto px-4">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">Look like you're lost</h3>
                <p>The page you are looking for is not available!</p>

                {/* Use <a> instead of Next.js <Link> */}
                <a href="/" className="link_404">
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
