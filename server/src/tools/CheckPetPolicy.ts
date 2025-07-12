import { ToolBase, ToolInput, ToolResult } from './ToolBase';
import db from '../database/db';
import { CheckPetPolicyClassifier } from '../orchestration/tools/CheckPetPolicyClassifier';

export class CheckPetPolicy extends ToolBase {
  name = 'check_pet_policy';
  description = 'Check the pet policy for a given property or service.';
  private classifier: CheckPetPolicyClassifier;

  constructor(classifier?: CheckPetPolicyClassifier) {
    super();
    this.classifier = classifier || new CheckPetPolicyClassifier(process.env.OPENAI_API_KEY!);
  }

  async execute(input: ToolInput): Promise<ToolResult> {
    // Use classifier to determine pet_type if not provided
    let petType = input.pet_type;
    if (!petType && input.context) {
      petType = await this.classifier.classifyPetType(input.context);
    }
    if (petType === 'cat' || petType === 'dog') {
      return {
        success: true,
        data: { petsAllowed: false, input, petType },
        message: 'Cats and dogs are allowed for an additional fee.',
        action: 'handoff_human',
      };
    }
    return {
      success: false,
      data: { petsAllowed: false, input, petType },
      message: 'Only normal pets are allowed.',
      action: 'none',
    };
  }
} 