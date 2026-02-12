from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:5173")
            page.goto("http://localhost:5173")
            page.wait_for_selector("text=Math Sticks", timeout=10000)

            # Check for new UI elements
            print("Checking for Score")
            page.wait_for_selector("text=Score:", timeout=5000)

            print("Checking for Round")
            page.wait_for_selector("text=Round:", timeout=5000)

            print("Checking for Time")
            page.wait_for_selector("text=Time:", timeout=5000)

            print("Taking screenshot")
            page.screenshot(path="/tmp/verification/game_ui.png")
            print("Screenshot saved to /tmp/verification/game_ui.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/tmp/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
