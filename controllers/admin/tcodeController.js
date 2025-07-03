
const tcodeService = require('../../services/tcodeService');

exports.index = async (req, res) => {
  const tcodes = await tcodeService.getAllTcodes();
  const editId = req.query.edit;

  let tcodeToEdit = null;
  if (editId) {
    tcodeToEdit = await tcodeService.getTcodeById(parseInt(editId));
  }

  res.render('tcode_master', {
    tcodes,
    tcodeToEdit
  });
};

exports.create = async (req, res) => {
  try {
    const { name, slug, type } = req.body;
    const data = { tcodeName: slug, title: name /* ,type if in schema */ };
    console.log('CreateTcode input:', data);
    await tcodeService.createTcode(data);
    req.flash('success', 'Tcode created successfully');
  } catch (err) {
    console.error('CreateTcode error:', err.message);
    req.flash('error', err.message);
  }
  res.redirect('/admin/tcode');
};

exports.update = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await tcodeService.updateTcode(id, {
      title: req.body.title, // ✅ correct key
    });
    req.flash('success', 'Tcode updated');
  } catch (err) {
    console.error('UpdateTcode error:', err.message);
    req.flash('error', err.message);
  }
  res.redirect('/admin/tcode');
};

exports.delete = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await tcodeService.deleteTcode(id);
    req.flash('success', 'Tcode deleted');
  } catch (err) {
    console.error('DeleteTcode error:', err.message);
    req.flash('error', err.message);
  }
  res.redirect('/admin/tcode');
};
