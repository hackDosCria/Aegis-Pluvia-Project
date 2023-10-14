use solana_program::program_error::ProgramError;

#[derive(Debug)]
pub enum Instruction {
    Register,
    Measure,
}

impl Instruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;

        match tag {
            0 => return Ok(Instruction::Register),
            1 => return Ok(Instruction::Measure),
            _ => Err(ProgramError::InvalidInstructionData)
        }
    }
}
