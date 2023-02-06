export function executeCommand(fn: () => Promise<any>) {
  fn()
    .then(() => {
      console.log('Command finished with success.')
    })
    .catch((error: any) => {
      console.error('Command finished with error.')
      console.error(error)
    })
}
