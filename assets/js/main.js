const COMMANDS = {
    'add r0,r1': '000 0000 0010 0000 0001',
    'not r0': '010 0000 0010 0000 0000',
    'nand r0,r1': '010 0000 0010 0000 0001',
    'sub r0,r1': '011 0000 0010 0000 0001',
    'shl r0,1': '001 0100 0010 0000 0000',
    'shr r0,1': '001 1000 0010 0000 0000',
    'mov r0,r1': '001 0000 0010 0000 1000',
    'mov r0,r2': '001 0000 0010 0001 0000',
    'mov r0,r3': '001 0000 0010 0001 1000',
    'mov r0,r4': '001 0000 0010 0010 0000',
    'mov r0,r5': '001 0000 0010 0010 1000',
    'mov r0,r6': '001 0000 0010 0011 0000',
    'mov r0,r7': '001 0000 0010 0011 1000',
    'mov r1,r0': '001 0000 0010 0100 0000',
    'mov r2,r0': '001 0000 0010 1000 0000',
    'mov r3,r0': '001 0000 0010 1100 0000',
    'mov r4,r0': '001 0000 0011 0000 0000',
    'mov r5,r0': '001 0000 0011 0100 0000',
    'mov r6,r0': '001 0000 0011 1000 0000',
    'mov r7,r0': '001 0000 0011 1100 0000',
    'mov mar,r0': '001 0010 0000 0000 0000',
    'mov r0,mbr': '101 0000 0010 0000 0000',
    'mov mbr,r0': '001 0001 0000 0000 0000',
    in: '001 0001 1000 0000 0000',
    out: '001 0000 0100 0000 0000',
};

let output = [];

const file_input = document.getElementById('file_input');
file_input.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (!file.type || !file.type.startsWith('text/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        compile(e.target.result);
        printCode();
    };
    reader.readAsText(file);
});

const compile = (code) => {
    for (const line of code.split('\n')) {
        const command = getCommand(line);
        if (command) output.push(generateOutput(command));
    }
};

const getCommand = (line) => {
    // const regex = /^[\t ]*(\w+)(?:[\t ]+(r\d|\w+)(?:[\t ]*(,)[\t ]*(r\d|\d|\w+))?)?(?:[\t ]*;.*)*$/gm;
    const rg_m_o_o =
        /^[\t ]*(\w+)[\t ]+(r\d|\w+)[\t ]*(,)[\t ]*(r\d|\d|\w+)(?:[\t ]*;.*)*/;
    const rg_m_o = /^[\t ]*(\w+)[\t ]+(r\d|\w+)(?:[\t ]*;.*)*/;
    const rg_m = /^[\t ]*(\w+)(?:[\t ]*;.*)*/;

    let command = '';

    if (rg_m_o_o.test(line)) {
        const match = rg_m_o_o.exec(line);

        command = `${match[1]} ${match[2]}${match[3]}${match[4]}`;
    } else if (rg_m_o.test(line)) {
        const match = rg_m_o.exec(line);

        command = `${match[1]} ${match[2]}`;
    } else if (rg_m.test(line)) {
        const match = rg_m.exec(line);

        command = `${match[1]}`;
    }

    return command.toLowerCase();
};

const generateOutput = (command) => {
    let opcode = COMMANDS[command] ?? '0000 0000 0000 0000 0000';
    let MIR = opcode
        .split(' ')
        .map((x) => parseInt(x.padStart(4, '0'), 2).toString(16).toUpperCase())
        .join('');
    if (MIR.length % 2 !== 0) MIR = `0${MIR}`;

    let address = Object.keys(COMMANDS)
        .indexOf(command)
        .toString(16)
        .toUpperCase();

    let formated = { MIR, address, command };

    return formated;
};

const printCode = () => {
    const output_area = document.getElementById('output');

    let container = document.createElement('div');
    container.classList.add('container');

    let table = document.createElement('table');
    table.classList.add(
        'table',
        'table-dark',
        'table-striped',
        'table-hover',
        'table-sm',
        'text-center'
    );

    let thead = document.createElement('thead');
    let tr_h = document.createElement('tr');

    let th_id = document.createElement('th');
    th_id.scope = 'col';
    th_id.classList.add('ps-2');
    th_id.innerText = '#';
    tr_h.appendChild(th_id);

    let th_MIR = document.createElement('th');
    th_MIR.scope = 'col';
    th_MIR.classList.add('text-secondary');
    th_MIR.innerText = 'MIR';
    tr_h.appendChild(th_MIR);

    let th_address = document.createElement('th');
    th_address.scope = 'col';
    th_address.innerText = 'Address';
    tr_h.appendChild(th_address);

    let th_code = document.createElement('th');
    th_code.scope = 'col';
    th_code.classList.add('text-secondary');
    th_code.innerText = 'Code';
    tr_h.appendChild(th_code);

    thead.appendChild(tr_h);

    table.appendChild(thead);

    let tbody = document.createElement('tbody');

    output.forEach((o) => {
        let tr_b = document.createElement('tr');

        let td_id = document.createElement('th');
        td_id.scope = 'row';
        td_id.classList.add('ps-2');

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('form-check-input', 'me-2');
        td_id.appendChild(checkbox);

        let label = document.createElement('label');
        label.classList.add('form-check-label');
        label.innerText = `${output.indexOf(o) + 1}`.padStart(2, '0');
        td_id.appendChild(label);

        tr_b.appendChild(td_id);

        let td_MIR = document.createElement('td');
        td_MIR.classList.add('text-secondary');
        td_MIR.innerText = o.MIR.replace(/.{2}/g, '$& ');
        tr_b.appendChild(td_MIR);

        let td_address = document.createElement('td');
        td_address.innerText = `${o.address}`.padStart(2, '0');
        tr_b.appendChild(td_address);

        let td_code = document.createElement('td');
        td_code.classList.add('text-secondary');
        td_code.innerText = o.command;
        tr_b.appendChild(td_code);

        tbody.appendChild(tr_b);
    });

    table.appendChild(tbody);

    container.appendChild(table);

    output_area.appendChild(container);
};
