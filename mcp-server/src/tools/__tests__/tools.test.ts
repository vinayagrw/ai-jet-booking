import { executeTool } from '../index.js';

describe('Tools', () => {
  describe('searchJets', () => {
    it('should search for jets', async () => {
      const result = await executeTool('searchJets', {
        departure: 'Delhi',
        arrival: 'Mumbai',
        date: '2024-03-22'
      });

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('type');
    });
  });

  describe('createBooking', () => {
    it('should create a booking', async () => {
      const result = await executeTool('createBooking', {
        jet_id: 'jet1',
        user_id: 'user1',
        departure: 'Delhi',
        arrival: 'Mumbai',
        departure_time: '2024-03-22T10:00:00Z',
        arrival_time: '2024-03-22T12:00:00Z',
        passengers: 4
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('booking_id');
      expect(result.data).toHaveProperty('status');
      expect(result.data.status).toBe('confirmed');
    });
  });

  describe('getBookingStatus', () => {
    it('should get booking status', async () => {
      const result = await executeTool('getBookingStatus', {
        booking_id: 'booking123'
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('booking_id');
      expect(result.data).toHaveProperty('status');
      expect(result.data).toHaveProperty('jet');
    });
  });

  describe('updateFleetJet', () => {
    it('should update fleet jet status', async () => {
      const result = await executeTool('updateFleetJet', {
        jet_id: 'jet1',
        status: 'maintenance',
        location: 'Delhi'
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('jet_id');
      expect(result.data).toHaveProperty('status');
      expect(result.data.status).toBe('maintenance');
    });
  });

  describe('manageMembership', () => {
    it('should manage membership', async () => {
      const result = await executeTool('manageMembership', {
        user_id: 'user1',
        action: 'create',
        type: 'premium',
        benefits: ['Priority booking', 'Lounge access']
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('user_id');
      expect(result.data).toHaveProperty('membership');
      expect(result.data.membership).toHaveProperty('type');
      expect(result.data.membership.type).toBe('premium');
    });
  });

  describe('generateReport', () => {
    it('should generate a report', async () => {
      const result = await executeTool('generateReport', {
        type: 'booking',
        start_date: '2024-03-01',
        end_date: '2024-03-31'
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('type');
      expect(result.data).toHaveProperty('start_date');
      expect(result.data).toHaveProperty('end_date');
      expect(result.data).toHaveProperty('total_bookings');
    });
  });

  describe('sendNotification', () => {
    it('should send a notification', async () => {
      const result = await executeTool('sendNotification', {
        recipient: 'user1',
        type: 'booking',
        subject: 'Booking Confirmed',
        content: 'Your booking has been confirmed',
        priority: 'high'
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('notification_id');
      expect(result.data).toHaveProperty('recipient');
      expect(result.data).toHaveProperty('status');
      expect(result.data.status).toBe('sent');
    });
  });
}); 