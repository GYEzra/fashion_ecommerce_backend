import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CUSTOM_MESSAGES } from 'src/common/enums/custom-messages.enum';
import { Utils } from 'src/utils/utils';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private addressModel: SoftDeleteModel<AddressDocument>,
  ) {}

  async create(createAddressDto: CreateAddressDto, userId: string): Promise<Address> {
    return await this.addressModel.create({
      ...createAddressDto,
      user: userId,
    });
  }

  async findAllByUser(userId: string): Promise<Address[]> {
    return await this.addressModel.find({ user: userId });
  }

  async findOne(id: string): Promise<Address | null> {
    return await this.addressModel.findById(id);
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address | null> {
    const address = await this.addressModel.findById(id);
    if (!address) {
      throw new NotFoundException(CUSTOM_MESSAGES.ADDRESS_ID_NOT_EXIST);
    }

    const changes = Utils.getDataChange(updateAddressDto, address.toObject());
    if (!changes) {
      return null;
    }

    return await this.addressModel.findByIdAndUpdate({ _id: id }, updateAddressDto, { new: true });
  }

  async remove(id: string): Promise<{ deleted: number }> {
    return await this.addressModel.softDelete({ id });
  }

  calculateShippingCost(province: string | null): number {
    return province === 'Hồ Chí Minh' ? 20000 : province ? 30000 : 0;
  }
}
