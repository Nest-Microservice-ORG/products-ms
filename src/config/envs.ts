import 'dotenv/config';
import * as joi from'joi';

//TODO: variables de entorno
interface EnvsVars {
    PORT: number;
    DATABASE_URL: string;
}

//TODO: esquema de validacion con joi
const envsSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );
 
if(error) {
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvsVars = value;

export const envs = {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
}