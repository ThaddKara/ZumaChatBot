import { ToolBase, ToolInput, ToolResult } from './ToolBase';
import db from '../database/db';
import { CheckAvailabilityClassifier } from '../orchestration/tools/CheckAvailabilityClassifier';

export class CheckingAvailability extends ToolBase {
  name = 'checking_availability';
  description = 'Check if a product or service is available for a given date or location.';
  private classifier: CheckAvailabilityClassifier;

  constructor(classifier?: CheckAvailabilityClassifier) {
    super();
    this.classifier = classifier || new CheckAvailabilityClassifier(process.env.OPENAI_API_KEY!);
  }

  async execute(input: ToolInput): Promise<ToolResult> {
    // Use classifier to determine room_type if not provided
    let roomType = input.room_type;
    if (!roomType && input.context) {
      roomType = await this.classifier.classifyBedrooms(input.context);
    }
    // Lookup room by name, id, or type
    let room: any;
    room = db.prepare('SELECT * FROM room WHERE type = ?').get(roomType)
    
    if (!room) {
      return {
        success: false,
        data: {},
        message: 'No matching room found.',
        action: 'handoff_human',
      };
    }
    if (!room.available) {
      return {
        success: false,
        data: { available: false, room },
        message: 'No vacancies available.',
        action: 'handoff_human',
      };
    }
    return {
      success: true,
      data: { available: true, room, date: input.date },
      message: `Yes! A ${roomType} is available, would you like to schedule a tour for ${room.name}?`,
      action: 'propose_tour',
    };
  }
} 