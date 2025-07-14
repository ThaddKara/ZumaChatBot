import { ToolBase, ToolInput, ToolResult } from './ToolBase';
import db from '../database/db';
import { CheckAvailabilityClassifier } from '../orchestration/tools/CheckAvailabilityClassifier';
import { Room } from '@/models/Room';

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
    console.log('roomType', roomType);

    if (roomType === 'any') {
      const rooms = db.prepare('SELECT * FROM room WHERE available = 1').all() as Room[];
      return {
        success: false,
        data: {},
        message: `Yes! here are the rooms available: ${rooms.map(r => ` (unit ${r.name})`).join('\n')}\n\nWould you like to schedule a tour for any of these rooms?`,
        action: 'handoff_human',
      };
    }
    // Lookup room by name, id, or type
    let room: any;
    room = db.prepare('SELECT * FROM room WHERE type = ? AND available = 1').get(roomType)
    if (!room) {
      room = db.prepare('SELECT * FROM room WHERE name = ? AND available = 1').get(roomType);
    }
    console.log('room', room);
    
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
      message: `Yes! A ${room.type} is available, would you like to schedule a tour for ${room.name}?`,
      action: 'propose_tour',
    };
  }
} 