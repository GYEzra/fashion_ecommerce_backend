import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { deleteFileFromDiskStorage, multerOptions } from 'src/config/multer.config';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiTags('files')
@Controller('files')
export class FilesController {
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload hình ảnh',
    type: FileUploadDto,
  })
  @ResponseMessage('Upload hình ảnh')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return file.filename;
  }

  @Delete(':fileName')
  @ResponseMessage('Xóa hình ảnh')
  delete(@Param('fileName') fileName: string) {
    return deleteFileFromDiskStorage(fileName);
  }
}
