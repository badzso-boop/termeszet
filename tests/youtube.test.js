const youtubeController = require('../src/controllers/youtubeController');

describe('YouTube Controller Unit Tests', () => {
  test('getVideos() sikeresen visszaadja a csatorna adatokat és a videók listáját', async () => {
    const req = {};
    let responseData = null;
    const res = {
      json: (data) => {
        responseData = data;
        return res;
      },
      status: (code) => res
    };

    await youtubeController.getVideos(req, res);

    expect(responseData).toBeDefined();
    expect(responseData.channel).toBeDefined();
    expect(responseData.channel.handle).toBe('@gabriellanemeth4897');
    expect(responseData.channel.title).toBe('Németh Gabriella');
    expect(Array.isArray(responseData.videos)).toBe(true);
    expect(responseData.videos.length).toBeGreaterThan(0);

    const firstVideo = responseData.videos[0];
    expect(firstVideo).toHaveProperty('id');
    expect(firstVideo).toHaveProperty('title');
    expect(firstVideo).toHaveProperty('url');
    expect(firstVideo).toHaveProperty('embedUrl');
    expect(firstVideo).toHaveProperty('thumbnailUrl');
  });
});
