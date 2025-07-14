export * from './ToolBase';
export * from './CheckingAvailability';
export * from './CheckPetPolicy';
export * from './GetPricing';

import { CheckingAvailability } from './CheckingAvailability';
import { CheckPetPolicy } from './CheckPetPolicy';
import { GetPricing } from './GetPricing';
import { ToolBase } from './ToolBase';
import { HelpTool } from './HelpTool';

export const toolRegistry: Record<string, ToolBase> = {
  user_wants_to_check_availability_of_room: new CheckingAvailability(),
  user_wants_to_check_pet_policy_for_room: new CheckPetPolicy(),
  user_wants_to_get_pricing_for_room: new GetPricing(),
  user_is_unsure: new HelpTool(),
}; 