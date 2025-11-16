import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    HttpCode,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Roles } from 'src/auth/decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guard';
import { OauthGuard } from 'src/auth/guard/oauth.guard';
import { ReviewCreateReq, ReviewUpdateReq } from 'src/dto/review.dto';
import { GetUserId } from 'src/auth/decorator/user.decorator';

@Controller('api/reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}
    @Get('')
    getAll() {
        return this.reviewService.getAll();
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return this.reviewService.getById(Number(id));
    }

    @Roles(Role.BOOK_ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(OauthGuard)
    @Post('')
    create(@Body() dto: ReviewCreateReq, @GetUserId('id') userId: number) {
        return this.reviewService.create(dto, userId);
    }

    @Roles(Role.BOOK_ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(OauthGuard)
    @Patch(':id')
    update(@Body() dto: ReviewUpdateReq, @Param('id') id: string) {
        return this.reviewService.update(dto, Number(id));
    }

    @Roles(Role.BOOK_ADMIN)
    @UseGuards(RolesGuard)
    @UseGuards(OauthGuard)
    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: string) {
        return this.reviewService.delete(Number(id));
    }
}
