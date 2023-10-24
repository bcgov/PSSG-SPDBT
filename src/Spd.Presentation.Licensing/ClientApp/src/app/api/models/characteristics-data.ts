/* tslint:disable */
/* eslint-disable */
import { EyeColourCode } from './eye-colour-code';
import { HairColourCode } from './hair-colour-code';
import { HeightUnitCode } from './height-unit-code';
import { WeightUnitCode } from './weight-unit-code';
export interface CharacteristicsData {
  eyeColourCode?: EyeColourCode;
  hairColourCode?: HairColourCode;
  height?: number;
  heightUnitCode?: HeightUnitCode;
  weight?: number;
  weightUnitCode?: WeightUnitCode;
}
