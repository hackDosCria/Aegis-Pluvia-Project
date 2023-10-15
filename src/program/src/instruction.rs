use solana_program::program_error::ProgramError;
use std::convert::TryInto;

#[derive(Debug)]
pub enum Instruction {
    Register(u16),
    Measure(u16),
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        match tag {
            0 => {
                if rest.len() != 2 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let val: Result<[u8; 2], _> = rest[..2].try_into();
                match val {
                    Ok(i) => {
                        return Ok(Instruction::Register(u16::from_le_bytes(i)));
                    },
                    _ => return Err(ProgramError::InvalidInstructionData)
                }
            }
            1 => {
                if rest.len() != 2 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let val: Result<[u8; 2], _> = rest[..2].try_into();
                match val {
                    Ok(i) => {
                        return Ok(Instruction::Measure(u16::from_le_bytes(i)));
                    },
                    _ => return Err(ProgramError::InvalidInstructionData)
                }
            }
            _ => Err(ProgramError::InvalidInstructionData)
        }
    }
}
