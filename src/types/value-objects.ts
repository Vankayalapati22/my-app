// Value Objects - Immutable, no identity

export class Money {
  constructor(
    readonly amount: number,
    readonly currency: string = 'USD'
  ) {
    if (amount < 0) throw new Error('Money amount cannot be negative');
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money in different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money in different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}

export class Email {
  private readonly value: string;

  constructor(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    this.value = email.toLowerCase();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

export class PhoneNumber {
  private readonly value: string;

  constructor(phoneNumber: string) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new Error('Invalid phone number format');
    }
    this.value = phoneNumber;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}

export class Duration {
  constructor(readonly seconds: number) {
    if (seconds < 0) throw new Error('Duration cannot be negative');
  }

  toString(): string {
    const hours = Math.floor(this.seconds / 3600);
    const minutes = Math.floor((this.seconds % 3600) / 60);
    const secs = this.seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ');
  }

  equals(other: Duration): boolean {
    return this.seconds === other.seconds;
  }
}

export class Rating {
  constructor(readonly value: number) {
    if (value < 0 || value > 5) throw new Error('Rating must be between 0 and 5');
  }

  equals(other: Rating): boolean {
    return this.value === other.value;
  }
}

export class FileSize {
  constructor(readonly bytes: number) {
    if (bytes < 0) throw new Error('File size cannot be negative');
  }

  toMB(): number {
    return this.bytes / (1024 * 1024);
  }

  toGB(): number {
    return this.bytes / (1024 * 1024 * 1024);
  }

  toString(): string {
    if (this.bytes < 1024) return `${this.bytes}B`;
    if (this.bytes < 1024 * 1024) return `${(this.bytes / 1024).toFixed(2)}KB`;
    if (this.bytes < 1024 * 1024 * 1024) return `${(this.bytes / (1024 * 1024)).toFixed(2)}MB`;
    return `${(this.bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  }

  equals(other: FileSize): boolean {
    return this.bytes === other.bytes;
  }
}

export class DateRange {
  constructor(
    readonly from: Date,
    readonly to: Date
  ) {
    if (from > to) throw new Error('Start date must be before end date');
  }

  includes(date: Date): boolean {
    return date >= this.from && date <= this.to;
  }

  equals(other: DateRange): boolean {
    return this.from.getTime() === other.from.getTime() && this.to.getTime() === other.to.getTime();
  }
}
