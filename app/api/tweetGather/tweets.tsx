import puppeteer from 'puppeteer';

async function scrapeTweets(username: string, count: number = 10): Promise<string[]> {
  const browser = await puppeteer.launch({ headless: true }); // Run in headless mode
  const page = await browser.newPage();

  try {
    // Navigate to the user's Twitter page
    await page.goto(`https://twitter.com/${username}`, { waitUntil: 'networkidle2' });

    // Wait for tweets to load
    await page.waitForSelector('article');

    // Extract tweet texts
    const tweets = await page.evaluate((count) => {
      const tweetElements = document.querySelectorAll('article');
      const tweets: string[] = [];

      tweetElements.forEach((tweet) => {
        const textElement = tweet.querySelector('div[lang]');
        if (textElement && tweets.length < count) {
          tweets.push(textElement.textContent?.trim() || '');
        }
      });

      return tweets;
    }, count);

    return tweets;
  } catch (error) {
    console.error('Error scraping tweets:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// Example usage
(async () => {
  const username = 'TwitterUsername'; // Replace with the desired username
  const tweets = await scrapeTweets(username, 15); // Fetch 15 latest tweets
  console.log('Latest Tweets:', tweets);
})();