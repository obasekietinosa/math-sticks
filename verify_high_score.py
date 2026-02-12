import os
from playwright.sync_api import sync_playwright

def verify_high_score():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Set localStorage before loading
        # Actually we need to load a page on the domain first to set localStorage
        page.goto("http://localhost:5173/")

        # Set High Score
        page.evaluate("localStorage.setItem('math-sticks-highscore', JSON.stringify({score: 1234, rounds: 5}))")
        page.evaluate("localStorage.setItem('math-sticks-tutorial-v2-seen', 'true')") # Skip tutorial

        # Reload to apply
        page.reload()

        # Check for High Score display
        try:
            # Look for "Best: 1234 pts (5 rounds)"
            # Note: The text might be split or have different spacing, so we use a loose locator or text match
            locator = page.get_by_text("Best: 1234 pts (5 rounds)")
            locator.wait_for()
            print("High score display found!")
        except Exception as e:
            print(f"High score display not found: {e}")

        # Take screenshot
        os.makedirs("verification", exist_ok=True)
        page.screenshot(path="verification/high_score_display.png")
        print("Screenshot saved to verification/high_score_display.png")

        browser.close()

if __name__ == "__main__":
    verify_high_score()
