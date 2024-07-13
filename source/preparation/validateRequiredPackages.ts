import {
  BuildException,
  exceptions,
  npxPackageAvailable,
  success,
  warn
} from './../utils';

export const validateRequiredPackages = async (): Promise<void> => {
  const requiredPkgs = [
    'esbuild',
    '@openapitools/openapi-generator-cli',
    'typescript',
    'corepack'
  ];
  const installedPkgs = await Promise.all(
    requiredPkgs.map((pkg) =>
      npxPackageAvailable(pkg).then((exists) => ({ pkg, exists }))
    )
  );
  for (const { pkg, exists } of installedPkgs) {
    if (exists) {
      success(pkg);
    } else {
      warn(
        `Please install missing packages:\n   - npm install -g ${installedPkgs
          .filter((installedPkg) => installedPkg.exists == false)
          .map((installedPkg) => installedPkg.pkg)
          .join(' ')} --save-dev`
      );
      throw new BuildException(exceptions.missingPackages);
    }
  }
};
