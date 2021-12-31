const ConfirmModal = (props) => {
    return(
        <div
				class='modal fade'
				id='confirmModal'
				data-backdrop='static'
				data-keyboard='false'
				tabindex='-1'
				aria-labelledby='modalLabel'
				aria-hidden='true'
			>
				<div class='modal-dialog modal-dialog-centered'>
					<div class='modal-content'>
						<div class='modal-body'>
							{props.message}
							<button
								type='button'
								class='close'
								data-dismiss='modal'
								aria-label='Close'
							>
								<span aria-hidden='true'>&times;</span>
							</button>
						</div>
						<div class='modal-footer'>
							<button
								type='button'
								class='btn btn-primary'
								data-dismiss='modal'
								onClick={() => props.action()}
							>
								Ok
							</button>
							<button
								type='button'
								class='btn btn-secondary'
								data-dismiss='modal'
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
    )
}

export default ConfirmModal