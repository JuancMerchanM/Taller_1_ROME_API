import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Total War: Rome II API",
      version: "1.0.0",
      description:
        "API RESTful para gestionar campañas de Total War: Rome II. " +
        "Incluye usuarios, facciones, campañas, ejércitos, generales, habilidades, unidades y estrategias.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Servidor de desarrollo",
      },
      {
        url: `https://taller-1-rome-api-rho.vercel.app`,
        description: "Servidor de produccion",
      },
    ],
    tags: [
      { name: "Auth", description: "Registro y autenticación de usuarios" },
      { name: "Factions", description: "Gestión de facciones" },
      { name: "Campaigns", description: "Gestión de campañas" },
      { name: "Armies", description: "Gestión de ejércitos" },
      { name: "Generals", description: "Gestión de generales" },
      { name: "Skills", description: "Gestión de habilidades" },
      { name: "Units", description: "Gestión de unidades" },
      { name: "Strategies", description: "Gestión de estrategias" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string", example: "Error message" },
          },
          required: ["success", "error"],
        },
        Success: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" },
          },
          required: ["success", "data"],
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            username: { type: "string", minLength: 3, maxLength: 30 },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["USER", "ADMIN"] },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", minLength: 3, maxLength: 30 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                token: { type: "string" },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/User" },
          },
        },
        Faction: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", minLength: 2, maxLength: 50 },
            culture: { type: "string", maxLength: 50 },
            category: {
              type: "string",
              enum: ["ROME", "GREEK", "BARBARIAN", "EASTERN", "NORTH_AFRICAN"],
            },
            startingRegion: { type: "string", maxLength: 100 },
            description: { type: "string", maxLength: 1000 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        FactionCreate: {
          type: "object",
          required: ["name", "culture", "category", "startingRegion"],
          properties: {
            name: { type: "string", minLength: 2, maxLength: 50 },
            culture: { type: "string", maxLength: 50 },
            category: {
              type: "string",
              enum: ["ROME", "GREEK", "BARBARIAN", "EASTERN", "NORTH_AFRICAN"],
            },
            startingRegion: { type: "string", maxLength: 100 },
            description: { type: "string", maxLength: 1000 },
          },
        },
        FactionArray: {
          type: "array",
          items: { $ref: "#/components/schemas/FactionCreate" },
        },
        Campaign: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", minLength: 3, maxLength: 100 },
            user: {
              type: "object",
              properties: {
                _id: { type: "string" },
                username: { type: "string" },
                email: { type: "string" },
              },
            },
            faction: { $ref: "#/components/schemas/Faction" },
            difficulty: {
              type: "string",
              enum: ["EASY", "NORMAL", "HARD", "VERY_HARD", "LEGENDARY"],
            },
            currentTurn: { type: "integer", minimum: 1 },
            year: { type: "integer" },
            status: {
              type: "string",
              enum: ["ACTIVE", "COMPLETED", "ABANDONED"],
            },
            description: { type: "string", maxLength: 1000 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CampaignCreate: {
          type: "object",
          required: ["name", "faction", "difficulty", "year"],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 100 },
            faction: { type: "string", description: "Faction ObjectId" },
            difficulty: {
              type: "string",
              enum: ["EASY", "NORMAL", "HARD", "VERY_HARD", "LEGENDARY"],
            },
            year: { type: "integer" },
            description: { type: "string", maxLength: 1000 },
          },
        },
        Army: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", minLength: 3, maxLength: 100 },
            campaign: { $ref: "#/components/schemas/Campaign" },
            general: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                level: { type: "integer" },
                title: { type: "string" },
              },
            },
            region: { type: "string", maxLength: 100 },
            movementPoints: { type: "integer", minimum: 0 },
            status: {
              type: "string",
              enum: ["ACTIVE", "DESTROYED", "DISBANDED"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        ArmyCreate: {
          type: "object",
          required: ["name", "campaign", "general", "region"],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 100 },
            campaign: { type: "string", description: "Campaign ObjectId" },
            general: { type: "string", description: "General ObjectId" },
            region: { type: "string", maxLength: 100 },
            movementPoints: { type: "integer", minimum: 0 },
            status: {
              type: "string",
              enum: ["ACTIVE", "DESTROYED", "DISBANDED"],
            },
          },
        },
        General: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", minLength: 3, maxLength: 100 },
            faction: { $ref: "#/components/schemas/Faction" },
            level: { type: "integer", minimum: 1, maximum: 10 },
            experience: { type: "integer", minimum: 0 },
            title: { type: "string", maxLength: 100 },
            skills: {
              type: "array",
              items: { $ref: "#/components/schemas/Skill" },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        GeneralCreate: {
          type: "object",
          required: ["name", "faction"],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 100 },
            faction: { type: "string", description: "Faction ObjectId" },
            level: { type: "integer", minimum: 1, maximum: 10 },
            experience: { type: "integer", minimum: 0 },
            title: { type: "string", maxLength: 100 },
            skills: {
              type: "array",
              items: { type: "string", description: "Skill ObjectId" },
            },
          },
        },
        Skill: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", minLength: 3, maxLength: 100 },
            category: {
              type: "string",
              enum: ["COMMAND", "AUTHORITY", "STRATEGY", "LOGISTICS"],
            },
            level: { type: "integer", minimum: 1, maximum: 5 },
            description: { type: "string", minLength: 5, maxLength: 500 },
            effects: {
              type: "object",
              properties: {
                morale: { type: "number" },
                meleeAttack: { type: "number" },
                meleeDefense: { type: "number" },
                movement: { type: "number" },
              },
            },
            prerequisite: {
              type: "string",
              nullable: true,
              description: "Skill ObjectId (prerequisite)",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        SkillCreate: {
          type: "object",
          required: ["name", "category", "level", "description"],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 100 },
            category: {
              type: "string",
              enum: ["COMMAND", "AUTHORITY", "STRATEGY", "LOGISTICS"],
            },
            level: { type: "integer", minimum: 1, maximum: 5 },
            description: { type: "string", minLength: 5, maxLength: 500 },
            effects: {
              type: "object",
              properties: {
                morale: { type: "number" },
                meleeAttack: { type: "number" },
                meleeDefense: { type: "number" },
                movement: { type: "number" },
              },
            },
            prerequisite: {
              type: "string",
              nullable: true,
              description: "Skill ObjectId (prerequisite)",
            },
          },
        },
        SkillArray: {
          type: "array",
          items: { $ref: "#/components/schemas/SkillCreate" },
        },
        Unit: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", minLength: 3, maxLength: 100 },
            faction: { $ref: "#/components/schemas/Faction" },
            type: {
              type: "string",
              enum: [
                "INFANTRY",
                "SPEARMEN",
                "CAVALRY",
                "MISSILE",
                "ARTILLERY",
                "ELEPHANT",
              ],
            },
            attack: { type: "integer", minimum: 0 },
            defense: { type: "integer", minimum: 0 },
            armor: { type: "integer", minimum: 0 },
            morale: { type: "integer", minimum: 0 },
            recruitmentCost: { type: "integer", minimum: 0 },
            description: { type: "string", maxLength: 1000 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        UnitCreate: {
          type: "object",
          required: [
            "name",
            "faction",
            "type",
            "attack",
            "defense",
            "armor",
            "morale",
            "recruitmentCost",
          ],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 100 },
            faction: { type: "string", description: "Faction ObjectId" },
            type: {
              type: "string",
              enum: [
                "INFANTRY",
                "SPEARMEN",
                "CAVALRY",
                "MISSILE",
                "ARTILLERY",
                "ELEPHANT",
              ],
            },
            attack: { type: "integer", minimum: 0 },
            defense: { type: "integer", minimum: 0 },
            armor: { type: "integer", minimum: 0 },
            morale: { type: "integer", minimum: 0 },
            recruitmentCost: { type: "integer", minimum: 0 },
            description: { type: "string", maxLength: 1000 },
          },
        },
        UnitArray: {
          type: "array",
          items: { $ref: "#/components/schemas/UnitCreate" },
        },
        Strategy: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string", minLength: 5, maxLength: 150 },
            author: {
              type: "object",
              properties: {
                _id: { type: "string" },
                username: { type: "string" },
              },
            },
            campaign: {
              type: "object",
              nullable: true,
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                difficulty: { type: "string" },
              },
            },
            faction: { $ref: "#/components/schemas/Faction" },
            difficulty: {
              type: "string",
              enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
            },
            tags: { type: "array", items: { type: "string", maxLength: 30 } },
            content: { type: "string", minLength: 20, maxLength: 5000 },
            recommendedUnits: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  type: { type: "string" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        StrategyCreate: {
          type: "object",
          required: ["title", "faction", "content"],
          properties: {
            title: { type: "string", minLength: 5, maxLength: 150 },
            faction: { type: "string", description: "Faction ObjectId" },
            content: { type: "string", minLength: 20, maxLength: 5000 },
            difficulty: {
              type: "string",
              enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
            },
            tags: { type: "array", items: { type: "string", maxLength: 30 } },
            recommendedUnits: {
              type: "array",
              items: { type: "string", description: "Unit ObjectId" },
            },
            campaign: {
              type: "string",
              nullable: true,
              description: "Campaign ObjectId",
            },
          },
        },
      },
    },
  },
  apis: [
    "./routes/*.mjs",
    "./authentication/authRoutes.mjs",
    "./app.mjs",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
