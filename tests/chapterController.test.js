// tests/chapterController.test.js

const chapterController = require('../controllers/admin/chapterController');
const chapterService    = require('../services/chapterService');
const tcodeService      = require('../services/tcodeService');

jest.mock('../services/chapterService');
jest.mock('../services/tcodeService');

const mockReq = (body = {}, params = {}, query = {}) => ({
  body,
  params,
  query,
  flash: jest.fn(),
});
const mockRes = () => ({
  render:   jest.fn(),
  redirect: jest.fn(),
});

describe('Chapter Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('index → renders view without edit', async () => {
    // mock dropdown data
    tcodeService.getAllTcodes.mockResolvedValue([{ tcodeName: 'physics', title: 'Physics' }]);

    // mock chapter list
    const chapterList = [{ id: 1, filename: 'ch1', name: 'Ch1', tcodeId: 1 }];
    chapterService.getChaptersForTcode.mockResolvedValue({
      tcode: { tcodeName: 'physics' },
      chapters: chapterList,
    });

    const req = mockReq({}, {}, { tcode: 'physics' });
    const res = mockRes();

    await chapterController.index(req, res);

    expect(tcodeService.getAllTcodes).toHaveBeenCalled();
    expect(chapterService.getChaptersForTcode).toHaveBeenCalledWith('physics');
    expect(res.render).toHaveBeenCalledWith(
      'chapter_master',
      expect.objectContaining({
        allTcodes: expect.any(Array),
        tcode:     { tcodeName: 'physics' },
        chapters:  chapterList,
        chapterToEdit: null,
      }),
    );
  });

  test('index → renders view with edit record', async () => {
    tcodeService.getAllTcodes.mockResolvedValue([{ tcodeName: 'physics', title: 'Physics' }]);

    const chapterToEdit = { id: 5, filename: 'edit-chap', name: 'Edit Name', tcodeId: 1 };
    chapterService.getChaptersForTcode.mockResolvedValue({
      tcode: { tcodeName: 'physics' },
      chapters: [],
    });
    chapterService.getChapterById.mockResolvedValue(chapterToEdit);

    const req = mockReq({}, {}, { tcode: 'physics', edit: '5' });
    const res = mockRes();

    await chapterController.index(req, res);

    expect(chapterService.getChapterById).toHaveBeenCalledWith(5);
    expect(res.render).toHaveBeenCalledWith(
      'chapter_master',
      expect.objectContaining({
        allTcodes: expect.any(Array),
        tcode:     { tcodeName: 'physics' },
        chapters:  [],
        chapterToEdit,
      }),
    );
  });

  test('create → calls service and redirects', async () => {
    const req = mockReq(
      { tcodeName: 'physics', title: 'New Chap', filename: 'new-chapter' },
      {},
      {},
    );
    const res = mockRes();

    await chapterController.create(req, res);

    expect(chapterService.createChapter).toHaveBeenCalledWith('physics', {
      title: 'New Chap',
      filename: 'new-chapter',
    });
    expect(res.redirect).toHaveBeenCalledWith('/admin/chapter?tcode=physics');
  });

  test('update → calls service and redirects', async () => {
    const req = mockReq(
      { tcodeName: 'physics', title: 'Updated Title' },
      { id: '2' },
      {},
    );
    const res = mockRes();

    await chapterController.update(req, res);

    expect(chapterService.updateChapter).toHaveBeenCalledWith(2, { title: 'Updated Title' });
    expect(res.redirect).toHaveBeenCalledWith('/admin/chapter?tcode=physics');
  });

  test('delete → calls service and redirects', async () => {
    const req = mockReq({}, { id: '3' }, { tcode: 'physics' });
    const res = mockRes();

    await chapterController.delete(req, res);

    expect(chapterService.deleteChapter).toHaveBeenCalledWith(3);
    expect(res.redirect).toHaveBeenCalledWith('/admin/chapter?tcode=physics');
  });
});
