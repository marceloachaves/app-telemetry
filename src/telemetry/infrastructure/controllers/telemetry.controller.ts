import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CreateTelemetryDto } from "src/telemetry/application/dtos/create-telemetry.dto";

interface RequestWithUser extends Request {
    user?: any;
}

@Controller('telemetry')
export class TelemetryController {

    @Post()
    createTelemetry(@Body() createTelemetryDto: CreateTelemetryDto, @Req() req: RequestWithUser) {

        //fazer requisição com o usuário ao banco postgres.
        // verificar se o device existe e se pertence ao tenant do usuário.

        const user = req.user;
        return { message: 'Telemetry data created', data: createTelemetryDto , user: user};
    }
}