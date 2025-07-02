const tcodeService = require('../../services/tcodeService');

exports.index = async (req, res) => {
  try {
    const tcodes = await tcodeService.getAllTcodes();
    res.render('admin/tcode/index', {
      tcodes,
      flash: req.flash()
    });
  } catch (err) {
    req.flash('error', 'Failed to load Tcodes');
    res.redirect('/');
  }
};
exports.create = async (req, res) => {
  try {
    // Step 1: Extract and map fields
    const { name, slug, type } = req.body;
    const data = {
      tcodeName: slug,
      title: name
    };

    console.log('CreateTcode input:', data);

    // Step 2: Call service
    const result = await tcodeService.createTcode(data);

    // Step 3: Handle result
    if (result) {
      req.flash('success', 'Tcode created successfully');
    } else {
      req.flash('error', 'Unknown error — tcode not created');
    }

  } catch (err) {
    console.error('CreateTcode error:', err.message);
    req.flash('error', err.message);
  }

  // Step 4: Always redirect back
  res.redirect('/admin/tcode');
};


exports.editForm = async (req, res) => {
  try {
    const tcode = await tcodeService.getTcodeById(parseInt(req.params.id));
    if (!tcode) {
      req.flash('error', 'Tcode not found');
      return res.redirect('/admin/tcode');
    }

    res.render('admin/tcode/edit', { tcode, flash: req.flash() });
  } catch (err) {
    req.flash('error', 'Error loading tcode');
    res.redirect('/admin/tcode');
  }
};

exports.update = async (req, res) => {
  try {
    await tcodeService.updateTcode(parseInt(req.params.id), req.body);
    req.flash('success', 'Tcode updated');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/admin/tcode');
};

exports.delete = async (req, res) => {
  try {
    await tcodeService.deleteTcode(parseInt(req.params.id));
    req.flash('success', 'Tcode deleted');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/admin/tcode');
};
