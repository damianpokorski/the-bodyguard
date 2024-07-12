import { SafetyNetBuildException } from "@utils/utils";
import { existsSync, rmSync } from "fs";

export const exceptionBuilder = (messages: string[]) => new SafetyNetBuildException(messages.join(" - "));

export const cleanUpDir = (path: string) => existsSync(path) && rmSync(path, { recursive: true });