export * from './ToolBase';
export * from './CheckingAvailability';
export * from './CheckPetPolicy';
export * from './GetPricing';

import { CheckingAvailability } from './CheckingAvailability';
import { CheckPetPolicy } from './CheckPetPolicy';
import { GetPricing } from './GetPricing';
import { ToolBase } from './ToolBase';

export const toolRegistry: Record<string, ToolBase> = {
  checking_availability: new CheckingAvailability(),
  check_pet_policy: new CheckPetPolicy(),
  get_pricing: new GetPricing(),
}; 