import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@4.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface WaitlistRequest {
  email: string;
  phone: string;
  zipCode: string;
  language: string;
  isOrganizer: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing waitlist signup request...');
    
    const { email, phone, zipCode, language, isOrganizer }: WaitlistRequest = await req.json();
    
    // Validate required fields
    if (!email || !phone || !zipCode) {
      console.error('Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Email, phone, and zip code are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Store waitlist signup in database
    console.log('Storing waitlist signup for:', email);
    const { data: signup, error: dbError } = await supabase
      .from('waitlist_signups')
      .insert({
        email,
        phone,
        zip_code: zipCode,
        language: language || 'Not specified',
        is_organizer: isOrganizer || false,
        source: 'CivicLink Waitlist'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store signup' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Waitlist signup stored successfully:', signup.id);

    // Get welcome email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('subject, html')
      .eq('name', 'welcome_email')
      .single();

    if (templateError) {
      console.error('Template error:', templateError);
      // Continue without sending email - signup was still successful
    } else {
      // Send welcome email
      console.log('Sending welcome email to:', email);
      try {
        const emailResponse = await resend.emails.send({
          from: 'CivicLink <onboarding@resend.dev>', // Using Resend's verified domain for testing
          to: [email],
          subject: template.subject || 'Welcome to CivicLink!',
          html: template.html || '<h1>Welcome to CivicLink!</h1><p>Thanks for joining our waitlist!</p>',
        });

        console.log('Email sent successfully:', emailResponse);
        
        // Log sent email to database
        await supabase
          .from('sent_emails')
          .insert({
            to_email: email,
            template_name: 'welcome_email',
            status: 'sent'
          });

      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the request if email fails - signup was successful
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully joined waitlist!',
        id: signup.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in join-waitlist function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);