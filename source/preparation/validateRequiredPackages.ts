import { exceptions } from './../utils/strings';
import {
  npxPackageAvailable,
  CribriBuildException,
  success,
  warn
} from './../utils/utils';

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
      throw new CribriBuildException(exceptions.missingPackages);
    }
  }
};
