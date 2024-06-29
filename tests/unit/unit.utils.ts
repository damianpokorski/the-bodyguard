import { SafetyNetBuildException } from "@utils/utils";

export const exceptionBuilder = (messages: string[]) => new SafetyNetBuildException(messages.join(" - "));
