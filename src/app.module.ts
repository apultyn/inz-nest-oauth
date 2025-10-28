import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        BookModule,
        PrismaModule,
        ConfigModule.forRoot({ isGlobal: true }),
        ReviewModule,
        AuthModule,
    ],
})
export class AppModule {}
