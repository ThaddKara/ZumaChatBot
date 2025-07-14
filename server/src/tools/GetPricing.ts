import { ToolBase, ToolInput, ToolResult } from './ToolBase';
import db from '../database/db';
import { GetPricingClassifier } from '../orchestration/tools/GetPricingClassifier';
import { Room } from '@/models/Room';

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
    if (!roomId) {
      const context = await this.classifier.classifyPricingContext(input.context);
      roomId = context;
    }

    // Lookup room
    let roomType = db.prepare('SELECT * FROM room WHERE type = ? AND available = 1').get(roomId) as Room;    
    if (!roomType) {
      let room = db.prepare('SELECT * FROM room WHERE name = ? AND available = 1').get(roomId) as Room;
      if (room) {
        return {
          success: true,
          data: { price: room.price, currency: 'USD', room: room, input },
          message: `The price for unit ${room.name} is $${room.price}. Would you like to schedule a tour for this unit?`,
          action: 'none',
        };
      } else {
        return {
          success: false,
          data: {},
          message: 'Which room do you want pricing for?',
          action: 'ask_clarification',
        };
      }
    }
    return {
      success: true,
      data: { price: roomType.price, currency: 'USD', room: roomType, input },
      message: `I found a ${roomType.type} (unit ${roomType.name}) that is $${roomType.price}. Would you like to schedule a tour for this unit?`,
      action: 'none',
    };
  }
} 