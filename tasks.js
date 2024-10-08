module.exports = (resources) => {
  const my = {}
  const shared = {
    ERR_INVALID_TYPE: "Invalid input type, it should be an array",
    ERR_EMPTY_FILES: `Missing files data, it shouldn't be empty`,
    ERR_MISSING_INPUT: "Input value is missing",
    // SHARED_VAR: value
    // ...
  }

  // ============================================================================

  my.run = async (input) => {
    const { s3_driver, _debug } = resources
    let output = {}

    try {
      const data = await setup(await validate( await load(input)))
      const notScannedFiles = data.files.filter(
        (file) =>
          !data.scanned_files.includes(file) &&
          !data.errored_files.includes(file)
      );
      await s3_driver.add("adaptus/path", notScannedFiles);
      output = notScannedFiles
    } catch (e) { 
      _debug(e.stack)
      output = { status: 'An error ocurred', message: e.message }
    }

    return output;

    async function load(input={}) {
      const config = {}
      config.files = input.files || [];
      config.scanned_files = input.scanned_files || [];
      config.errored_files = input.errored_files ||  [];
      return config
    }
    
    async function setup(config) {
      const data = {...config}
      // ...
      return data
    }

    async function validate(config) {
      const { files, scanned_files, errored_files } = { ...config }; 
      if (
        !Array.isArray(files) ||
        !Array.isArray(scanned_files) ||
        !Array.isArray(errored_files)
      ) {
        throw new Error(shared.ERR_INVALID_TYPE);
      }
      if (files.length === 0) {
        throw new Error(shared.ERR_EMPTY_FILES);
      }
      files.forEach((file, index) => {
        if (!file) {
          throw new Error(`${shared.ERR_MISSING_INPUT} at index: ${index}`);
        }
      });
      
      return config;
    }
  };

  return my
}
