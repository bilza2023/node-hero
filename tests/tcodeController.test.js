// tests/tcodeController.test.js

const tcodeController = require('../controllers/admin/tcodeController');
const tcodeService = require('../services/tcodeService');

jest.mock('../services/tcodeService');

const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
  flash: jest.fn(),
});
const mockRes = () => {
  const res = {};
  res.redirect = jest.fn();
  res.render = jest.fn();
  return res;
};

describe('Tcode Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create → calls service and redirects', async () => {
    const req = mockReq({ name: 'Math', slug: 'math' });
    const res = mockRes();

    await tcodeController.create(req, res);

    expect(tcodeService.createTcode).toHaveBeenCalledWith({
      tcodeName: 'math',
      title: 'Math'
    });
    expect(req.flash).toHaveBeenCalledWith('success', 'Tcode created successfully');
    expect(res.redirect).toHaveBeenCalledWith('/admin/tcode');
  });

  test('update → updates title and redirects', async () => {
    const req = mockReq({ title: 'New Title' }, { id: '42' });
    const res = mockRes();

    await tcodeController.update(req, res);

    expect(tcodeService.updateTcode).toHaveBeenCalledWith(42, { title: 'New Title' });
    expect(req.flash).toHaveBeenCalledWith('success', 'Tcode updated');
    expect(res.redirect).toHaveBeenCalledWith('/admin/tcode');
  });

  test('index → fetches tcodes and renders view', async () => {
    const req = mockReq({}, {}, {}); // ensure req.query exists
    const res = mockRes();
    const mockData = [{ id: 1, title: 'Physics' }];
    tcodeService.getAllTcodes.mockResolvedValue(mockData);

    await tcodeController.index(req, res);

    expect(tcodeService.getAllTcodes).toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith(
      'tcode_master',
      { tcodes: mockData, tcodeToEdit: null }
    );
  });
});
