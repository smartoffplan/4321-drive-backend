const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./env');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '4321 Drive Backend API',
      version: '1.0.0',
      description: 'Multi-vendor vehicle rental broker platform API. Browse vehicles, manage vendors, handle listings, and track inquiries.',
      contact: {
        name: '4321 Drive',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token from /auth/login or /auth/register',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation failed' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 20 },
            total: { type: 'integer', example: 50 },
            pages: { type: 'integer', example: 3 },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            full_name: { type: 'string', example: 'John Admin' },
            email: { type: 'string', example: 'john@4321drive.com' },
            phone: { type: 'string', example: '+971501234567' },
            role: { type: 'string', enum: ['super_admin', 'admin', 'vendor'] },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
            last_login_at: { type: 'string', format: 'date-time', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Vendor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            vendor_code: { type: 'string', example: 'EXT-0001' },
            vendor_type: { type: 'string', enum: ['own_fleet', 'external_vendor'] },
            company_name: { type: 'string', example: 'Premium Cars LLC' },
            garage_name: { type: 'string', nullable: true },
            contact_person_name: { type: 'string', nullable: true },
            contact_person_email: { type: 'string', nullable: true },
            contact_person_phone: { type: 'string', nullable: true },
            whatsapp_number: { type: 'string', nullable: true },
            company_phone: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['active', 'inactive', 'pending_verification', 'blocked'] },
            priority_rank: { type: 'integer' },
            is_priority_vendor: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ParentVehicle: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            slug: { type: 'string', example: 'audi-a8' },
            display_name: { type: 'string', example: 'Audi A8' },
            brand: { type: 'string', example: 'Audi' },
            model: { type: 'string', example: 'A8' },
            variant: { type: 'string', nullable: true },
            model_year: { type: 'integer', example: 2024 },
            category: { type: 'string', example: 'Luxury Sedan' },
            tags: { type: 'array', items: { type: 'string' } },
            main_image: { type: 'string', nullable: true },
            gallery_images: { type: 'array', items: { type: 'string' } },
            description: { type: 'string', nullable: true },
            specs: {
              type: 'object',
              properties: {
                passengers: { type: 'integer' },
                luggage: { type: 'integer' },
                transmission: { type: 'string' },
                doors: { type: 'integer' },
                engine: { type: 'string' },
                fuel_type: { type: 'string' },
                horsepower: { type: 'string' },
                acceleration: { type: 'string' },
                top_speed: { type: 'string' },
                drive_type: { type: 'string' },
              },
            },
            pricing_summary: {
              type: 'object',
              properties: {
                display_price_mode: { type: 'string' },
                display_price_override: { type: 'number', nullable: true },
                calculated_min_daily_price: { type: 'number', nullable: true },
                public_starting_price: { type: 'number', nullable: true },
                weekly_price_public: { type: 'number', nullable: true },
                monthly_price_public: { type: 'number', nullable: true },
              },
            },
            display_settings: {
              type: 'object',
              properties: {
                is_featured: { type: 'boolean' },
                sort_priority: { type: 'integer' },
                show_on_frontend: { type: 'boolean' },
              },
            },
            public_status: { type: 'string', enum: ['draft', 'active', 'inactive', 'archived'] },
            seo: {
              type: 'object',
              properties: {
                meta_title: { type: 'string', nullable: true },
                meta_description: { type: 'string', nullable: true },
                canonical_url: { type: 'string', nullable: true },
              },
            },
          },
        },
        VehicleListing: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            parent_vehicle_id: { type: 'string' },
            vendor_id: { type: 'string' },
            listing_title_override: { type: 'string', nullable: true },
            own_fleet_priority: { type: 'boolean' },
            pricing: {
              type: 'object',
              properties: {
                vendor_base_price_per_day: { type: 'number', nullable: true },
                website_selling_price_per_day: { type: 'number', nullable: true },
                display_price_candidate_per_day: { type: 'number', nullable: true },
                weekly_price: { type: 'number', nullable: true },
                monthly_price: { type: 'number', nullable: true },
              },
            },
            chauffeur: {
              type: 'object',
              properties: {
                driver_available: { type: 'boolean' },
                driver_price_per_day: { type: 'number', nullable: true },
                driver_notes: { type: 'string', nullable: true },
              },
            },
            availability_status: { type: 'string', enum: ['draft', 'pending_approval', 'active', 'temporarily_unavailable', 'booked', 'inactive', 'rejected', 'archived'] },
            verification: {
              type: 'object',
              properties: {
                is_verified: { type: 'boolean' },
                approval_status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                approval_notes: { type: 'string', nullable: true },
              },
            },
          },
        },
        InquiryLog: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            parent_vehicle_id: { type: 'string' },
            source_action: { type: 'string', example: 'whatsapp_click' },
            driver_selected: { type: 'boolean' },
            page_type: { type: 'string', nullable: true },
            utm_source: { type: 'string', nullable: true },
            utm_medium: { type: 'string', nullable: true },
            utm_campaign: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;
