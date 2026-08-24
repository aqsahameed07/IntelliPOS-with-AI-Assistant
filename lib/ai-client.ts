// lib/ai-client.ts
const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8000';

export interface AIResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

export const aiClient = {
  async sendMessage(message: string, userId: string, userEmail: string): Promise<AIResponse> {
    // Try Python service first
    try {
      const response = await fetch(`${AI_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId, userEmail }),
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('AI service unavailable, using fallback');
    }

    // Fallback: Use simple responses
    return {
      success: true,
      reply: getFallbackResponse(message),
    };
  },

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${AI_API_URL}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok) {
        return await response.json();
      }
      return { status: 'unavailable' };
    } catch {
      return { status: 'unavailable' };
    }
  },

  async getStats(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${AI_API_URL}/stats`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!response.ok) {
        return { success: false, error: 'Failed to fetch stats' };
      }
      return await response.json();
    } catch {
      return { 
        success: true, 
        data: {
          products: 0,
          customers: 0,
          employees: 0,
          revenue: '$0',
          orders: 0
        }
      };
    }
  },
};

// Fallback responses when AI service is unavailable
function getFallbackResponse(message: string): string {
  const text = message.toLowerCase().trim();
  
  // Business hours
  if (text.includes('hours') || text.includes('open') || text.includes('timing')) {
    return "🕐 Our business hours are 9:00 AM - 6:00 PM, Monday-Friday.";
  }
  
  // Contact
  if (text.includes('contact') || text.includes('support') || text.includes('email')) {
    return "📧 For support, email: support@nimbus.io\n📞 Phone: +1 (555) 123-4567";
  }
  
  // Products/Inventory
  if (text.includes('product') || text.includes('inventory') || text.includes('stock')) {
    return "📦 You can manage products in the Products section. I can help you check stock levels, add new products, and manage inventory.";
  }
  
  // Customers
  if (text.includes('customer')) {
    return "👥 Customer management is available in the Customers section. You can view customer lists, check purchase history, and manage profiles.";
  }
  
  // Sales/Revenue
  if (text.includes('sale') || text.includes('revenue') || text.includes('earning')) {
    return "💰 Check the Dashboard for revenue and sales metrics including total revenue, order statistics, and monthly trends.";
  }
  
  // Employees
  if (text.includes('employee') || text.includes('staff') || text.includes('team')) {
    return "👔 Employee management is in the Employees section. You can view team members, manage roles, and track performance.";
  }
  
  // Help
  if (text.includes('help') || text.includes('what can you do')) {
    return "🤖 I can help with:\n• 📦 Products & Inventory\n• 👥 Customers & Orders\n• 💰 Sales & Revenue\n• 👔 Employees & Teams\n• 🕐 Business hours\n• 📧 Contact information";
  }
  
  // Greetings
  if (['hello', 'hi', 'hey', 'good morning', 'good afternoon'].some(word => text.includes(word))) {
    return "Hello! 👋 How can I help you today? Try asking about products, customers, sales, or employees!";
  }
  
  // Thank you
  if (text.includes('thank')) {
    return "You're welcome! 😊 Is there anything else I can help you with?";
  }
  
  // Goodbye
  if (text.includes('bye') || text.includes('goodbye')) {
    return "Goodbye! 👋 Have a great day! Come back anytime if you need help.";
  }
  
  return "I'm not sure how to help with that. Try asking about:\n• Products\n• Customers\n• Sales/Revenue\n• Employees\n• Business hours\n• Contact information";
}