use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};

pub mod instruction;
use crate::instruction::Instruction;

// declare and export the program's entrypoint
entrypoint!(process_instruction);

// program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    msg!("Starting program");

    let instruction = Instruction::unpack(instruction_data)?;
    match instruction {
        Instruction::Register => {
            msg!("Registered new Pluviometer");
        },
        Instruction::Measure => {
            msg!("New Measure received");
        }
    }

    // gracefully exit the program
    Ok(())
}
