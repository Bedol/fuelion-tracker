const NewFueling = () => {
  return (
    <div>
      <h2>Add your fuel cost</h2>

      <form>
        {/* data */}
        {/* kraj */}
        {/* region */}
        {/* stacja */}
        {/* rodzaj paliwa */}
        {/* cena za litr */}
        {/* Waluta */}
        {/* Dystans przejechany */}
        {/* Przebieg */}
        {/* Rodzaj tankowania - do pełna lub nie */}
        {/* Rodzaj opon */}
        {/* Klimatyzacja */}

        <label htmlFor="amount">Amount of fuel</label>
        <input type="text" name="amount" id="amount" />

        <label htmlFor="cost">Cost of fuel</label>
        <input type="text" name="cost" id="cost" />

        <input type="submit" value="Add" />
      </form>
    </div>
  );
};

export default NewFueling;
