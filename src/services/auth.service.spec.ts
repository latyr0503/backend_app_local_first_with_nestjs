import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole, Sexe } from '../entities/user.entity';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      phone_number: '+221701234567',
      adresse: '123 Rue de la Paix, Dakar',
      sexe: Sexe.HOMME,
      role: UserRole.AGENT,
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: 'user-id',
        ...registerDto,
        password: hashedPassword,
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('access-token');
      mockJwtService.signAsync.mockResolvedValue('refresh-token');

      // Mock bcrypt.hash
      jest.mock('bcrypt', () => ({
        hash: jest.fn().mockResolvedValue(hashedPassword),
      }));

      const result = await service.register(registerDto);

      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        phone_number: mockUser.phone_number,
        adresse: mockUser.adresse,
        sexe: mockUser.sexe,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword123',
        phone_number: '+221701234567',
        adresse: '123 Rue de la Paix, Dakar',
        sexe: Sexe.HOMME,
        role: UserRole.AGENT,
        createdAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue('access-token');
      mockJwtService.signAsync.mockResolvedValue('refresh-token');

      // Mock bcrypt.compare
      jest.mock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(true),
      }));

      const result = await service.login(loginDto);

      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        phone_number: mockUser.phone_number,
        adresse: mockUser.adresse,
        sexe: mockUser.sexe,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword123',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      // Mock bcrypt.compare
      jest.mock('bcrypt', () => ({
        compare: jest.fn().mockResolvedValue(false),
      }));

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
