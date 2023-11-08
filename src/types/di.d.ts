import { TypeLib } from "src/core/ro/TypeLib";
import { ROError } from "src/core/ro/roError";
import { ROLiteral } from "src/core/ro/roLiteral";

export interface DependencyInjection {
    typeLib?: TypeLib;
    roError?: ROError;
    roLiteral?: ROLiteral;
}