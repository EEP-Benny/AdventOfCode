package main

import (
	"reflect"
	"testing"
)

func Test_hexToBin(t *testing.T) {
	type args struct {
		hexString string
	}
	tests := []struct {
		name          string
		args          args
		wantBinString string
	}{
		{"example 1", args{"D2FE28"}, "110100101111111000101000"},
		{"example 2", args{"38006F45291200"}, "00111000000000000110111101000101001010010001001000000000"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if gotBinString := hexToBin(tt.args.hexString); gotBinString != tt.wantBinString {
				t.Errorf("hexToBin() = %v, want %v", gotBinString, tt.wantBinString)
			}
		})
	}
}

func Test_parsePacket(t *testing.T) {
	type args struct {
		binString string
	}
	tests := []struct {
		name           string
		args           args
		wantPacket     Packet
		wantRestString string
	}{
		{"example literal", args{"110100101111111000101000"}, Packet{version: 6, typeID: 4, literalValue: 2021}, "000"},
		{"example with total length of subpackets", args{"00111000000000000110111101000101001010010001001000000000"},
			Packet{version: 1, typeID: 6, subPackets: []Packet{
				{version: 6, typeID: 4, literalValue: 10},
				{version: 2, typeID: 4, literalValue: 20},
			}}, "0000000"},
		{"example with number of subpackets", args{"11101110000000001101010000001100100000100011000001100000"},
			Packet{version: 7, typeID: 3, subPackets: []Packet{
				{version: 2, typeID: 4, literalValue: 1},
				{version: 4, typeID: 4, literalValue: 2},
				{version: 1, typeID: 4, literalValue: 3},
			}}, "00000"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			gotPacket, gotRestString := parsePacket(tt.args.binString)
			if !reflect.DeepEqual(gotPacket, tt.wantPacket) {
				t.Errorf("parsePacket() gotPacket = %v, want %v", gotPacket, tt.wantPacket)
			}
			if gotRestString != tt.wantRestString {
				t.Errorf("parsePacket() gotRestString = %v, want %v", gotRestString, tt.wantRestString)
			}
		})
	}
}

func dropRestString(packet Packet, _restString string) Packet {
	return packet
}

func Test_sumPacketVersions(t *testing.T) {
	type args struct {
		packet Packet
	}
	tests := []struct {
		name string
		args args
		want int
	}{
		{"example 1", args{dropRestString(parsePacket(hexToBin("8A004A801A8002F478")))}, 16},
		{"example 2", args{dropRestString(parsePacket(hexToBin("620080001611562C8802118E34")))}, 12},
		{"example 3", args{dropRestString(parsePacket(hexToBin("C0015000016115A2E0802F182340")))}, 23},
		{"example 4", args{dropRestString(parsePacket(hexToBin("A0016C880162017C3686B18A3D4780")))}, 31},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := sumPacketVersions(tt.args.packet); got != tt.want {
				t.Errorf("sumPacketVersions() = %v, want %v", got, tt.want)
			}
		})
	}
}
