import { Body, Controller, Post } from "@nestjs/common";
import { SendMessageDto } from "../../application/dtos/send-msg.dto";
import { SendMessageUseCase } from "../../application/use-cases/send-message.use-case";

@Controller({
    version: '1',
    path: 'bot',
})
export class BotController {
    constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}
    @Post('chat')
    async chat(@Body() body: SendMessageDto) {
        return this.sendMessageUseCase.execute(body);
    }
}