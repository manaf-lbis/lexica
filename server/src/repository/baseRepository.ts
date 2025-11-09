import { Model, Document, Types } from "mongoose";
import { IBaseRepository } from "./interface/IBaseRepository";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  private readonly _model: Model<T>;

  constructor(model: Model<T>) {
    this._model = model;
  }

  async create(item: Partial<T>): Promise<T> {
    const newItem = new this._model(item);
    return await newItem.save();
  }

  async findById(id: Types.ObjectId): Promise<T | null> {
    return await this._model.findById(id).exec();
  }

  async findAll(): Promise<T[]> {
    return await this._model.find().exec();
  }

  async update(id: Types.ObjectId, item: Partial<T>): Promise<T | null> {
    return await this._model.findByIdAndUpdate(id, item, { new: true }).exec();
  }

  async delete(id: Types.ObjectId): Promise<T | null> {
    return await this._model.findByIdAndDelete(id).exec();
  }
  
}
