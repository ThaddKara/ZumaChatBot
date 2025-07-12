import { ToolBase, ToolInput, ToolResult } from './ToolBase';
import db from '../database/db';
import { GetPricingClassifier } from '../orchestration/tools/GetPricingClassifier';

export class GetPricing extends ToolBase {
  name = 'get_pricing';
  description = 'Get pricing information for a product or service.';
  private classifier: GetPricingClassifier;

  constructor(classifier?: GetPricingClassifier) {
    super();
    this.classifier = classifier || new GetPricingClassifier(process.env.OPENAI_API_KEY!);
  }

  async execute(input: ToolInput): Promise<ToolResult> {
    // Use classifier to determine unitId and moveInDate if not provided
    let roomId = input.room_id;
    let date = input.date;
    if ((!roomId || !date) && input.context) {
      const context = await this.classifier.classifyPricingContext(input.context);
      if (!roomId && context.unitId) roomId = context.unitId;
      if (!date && context.moveInDate) date = context.moveInDate;
    }

    // Lookup room
    let room: any;
    room = db.prepare('SELECT * FROM room WHERE name = ?').get(roomId);
    
    if (!room) {
      return {
        success: false,
        data: {},
        message: 'Which room do you want pricing for?',
        action: 'ask_clarification',
      };
    }
    return {
      success: true,
      data: { price: room.price, currency: 'USD', room, input, date },
      message: `The price for ${room.name} is $${room.price}.`,
      action: 'none',
    };
  }
} 