import Monitor from '../Monitor';

jest.mock('../Message', () => {
  return {
    getInstance: jest.fn(),
    enqueue: jest.fn(),
  };
});

describe('Monitor Class test', () => {
  let monitor: Monitor;
  let pvTrackerMock: any;
  let uvTrackerMock: any;

  beforeEach(() => {
    pvTrackerMock = {
      trackPageView: jest.fn(),
    };

    uvTrackerMock = {
      // ...uvTrackerMock 的内容保持不变...
    };

    monitor = new Monitor('test_user_id', 'test_custom_key');
    // monitor.pvTracker = pvTrackerMock;
    // monitor.uvTracker = uvTrackerMock;

    // 使用 jest.spyOn 监视 window.history 和 window.addEventListener 的调用
    jest.spyOn(window.history, 'pushState');
    jest.spyOn(window.history, 'replaceState');
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');
  });

  test('startTracking method', async () => {
    monitor.startTracking();

    // 模拟页面路径变化
    window.history.pushState({}, '', '/new-path');

    // 验证 trackPageView 方法是否被正确调用
    expect(pvTrackerMock.trackPageView).toHaveBeenCalledWith(
      'pushState',
      {},
      '/new-path',
    );
  });

  test('stopTracking method', () => {
    monitor.stopTracking();

    expect(window.removeEventListener).toHaveBeenCalledTimes(4);
    expect(uvTrackerMock.stopRefreshInterval).toHaveBeenCalled();
  });

  test('onLoad method', async () => {
    await monitor.onLoad(new Event('load'));

    expect(uvTrackerMock.trackUv).toHaveBeenCalled();
    expect(pvTrackerMock.trackPageView).toHaveBeenCalledWith(
      'load',
      expect.any(Event),
    );
  });

  // 添加更多针对其他方法的测试...
});
