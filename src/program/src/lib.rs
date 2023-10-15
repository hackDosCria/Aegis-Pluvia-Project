use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg, program_error::ProgramError,
};
use borsh::{BorshDeserialize, BorshSerialize};

pub mod instruction;
use crate::instruction::Instruction;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct MeasurementAccount {
    pub region: u16,
    pub current_measure: u16,
}

// declare and export the program's entrypoint
entrypoint!(process_instruction);

// program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult {
    msg!("Starting program");
    // Get user Account
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        msg!("Account with wrong program ID");
        return Err(ProgramError::IncorrectProgramId);
    }
    let mut user_account = MeasurementAccount::try_from_slice(&account.data.borrow())?;

    // Run received instruction
    let instruction = Instruction::unpack(instruction_data)?;
    match instruction {
        Instruction::Register(val) => {
            user_account.region = val;
            user_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
            msg!("Registered new Pluviometer at region {}", val);
        },
        Instruction::Measure(val) => {
            user_account.current_measure = val;
            user_account.serialize(&mut &mut account.data.borrow_mut()[..])?;
            msg!("Measured {}mm of rain in region {}", val, user_account.region);
        }
    }

    // gracefully exit the program
    Ok(())
}
